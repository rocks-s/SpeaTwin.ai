"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import ViewWindow from "./ViewWindow";
import PhotoUpload from "./PhotoUpload";
import ScriptBox from "./ScriptBox";
import LookSelector from "./LookSelector";
import VoiceSelector from "./VoiceSelector";
import SubmitButton from "./SubmitButton";
import {
  LOOK_OPTIONS,
  VOICE_OPTIONS,
  ACCEPTED_IMAGE_TYPES,
  MAX_IMAGE_SIZE_MB,
} from "./constants";
import { createAvatarVideo } from "../../services/api/avatarApi";
import {
  loadOrders,
  setProcessingOrder,
  clearProcessingOrder,
  completeProcessingOrder,
  createOrderId,
} from "../../services/orders/orderStorage";
import { fileToDataUrl, dataUrlToFile } from "../../services/orders/fileHelpers";
import { runExclusiveGeneration } from "../../services/orders/generationLock";
import styles from "./home.module.css";

const ERROR_DISPLAY_MS = 30000;

function validatePhoto(file) {
  if (!file) {
    return "Please upload a portrait photo.";
  }

  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    return "Photo must be JPEG, PNG or WebP.";
  }

  const maxBytes = MAX_IMAGE_SIZE_MB * 1024 * 1024;
  if (file.size > maxBytes) {
    return `Photo must be smaller than ${MAX_IMAGE_SIZE_MB} MB.`;
  }

  return "";
}

function validateForm({ photo, script }) {
  const photoError = validatePhoto(photo);

  if (photoError) {
    return photoError;
  }

  if (!script.trim()) {
    return "Please enter a script for your digital twin.";
  }

  return "";
}

export default function HomePage() {
  const router = useRouter();
  const [photo, setPhoto] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [script, setScript] = useState("");
  const [look, setLook] = useState(LOOK_OPTIONS[0].id);
  const [voice, setVoice] = useState(VOICE_OPTIONS[0].id);
  const [photoError, setPhotoError] = useState("");
  const [formError, setFormError] = useState("");
  const [isFormLocked, setIsFormLocked] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const errorTimeoutRef = useRef(null);
  const isInitializedRef = useRef(false);

  const clearErrorTimeout = useCallback(() => {
    if (errorTimeoutRef.current) {
      clearTimeout(errorTimeoutRef.current);
      errorTimeoutRef.current = null;
    }
  }, []);

  const showTemporaryError = useCallback(
    (message) => {
      clearErrorTimeout();
      setFormError(message);
      errorTimeoutRef.current = setTimeout(() => {
        setFormError("");
        errorTimeoutRef.current = null;
      }, ERROR_DISPLAY_MS);
    },
    [clearErrorTimeout],
  );

  const resetForm = useCallback(() => {
    setPhoto(null);
    setPreviewUrl("");
    setScript("");
    setLook(LOOK_OPTIONS[0].id);
    setVoice(VOICE_OPTIONS[0].id);
    setPhotoError("");
    setIsFormLocked(false);
    setIsProcessing(false);
    setIsSubmitting(false);
  }, []);

  const restorePhotoFromOrder = useCallback(async (processingOrder) => {
    if (!processingOrder?.photoDataUrl) {
      return null;
    }

    return dataUrlToFile(
      processingOrder.photoDataUrl,
      processingOrder.photoName,
      processingOrder.photoType,
    );
  }, []);

  const runGeneration = useCallback(
    async ({ photoFile, script, look, voice }) => {
      if (!photoFile) {
        clearProcessingOrder();
        resetForm();
        showTemporaryError("Photo data is missing. Please upload a photo again.");
        return;
      }

      return runExclusiveGeneration(async () => {
        setIsSubmitting(true);
        setIsFormLocked(true);
        setIsProcessing(true);
        clearErrorTimeout();
        setFormError("");

        try {
          const result = await createAvatarVideo({
            photo: photoFile,
            script,
            look,
            voice,
          });


          const completedOrder = completeProcessingOrder(result.video_url);

          if (!completedOrder) {
            throw new Error("Failed to save completed order.");
          }

          router.push(
            `/completedOrder?id=${encodeURIComponent(completedOrder.id)}`,
          );
        } catch (error) {
          clearProcessingOrder();
          resetForm();
          showTemporaryError(
            error?.message ||
              "Something went wrong while generating your video.",
          );
        } finally {
          setIsSubmitting(false);
        }
      });
    },
    [clearErrorTimeout, resetForm, router, showTemporaryError],
  );

  useEffect(() => {
    return () => clearErrorTimeout();
  }, [clearErrorTimeout]);

  useEffect(() => {
    if (!photo) {
      setPreviewUrl("");
      return undefined;
    }

    const objectUrl = URL.createObjectURL(photo);
    setPreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [photo]);

  useEffect(() => {
    if (isInitializedRef.current) {
      return;
    }

    isInitializedRef.current = true;

    async function restoreProcessingOrder() {
      const orders = loadOrders();

      if (!orders.processing) {
        return;
      }

      const processingOrder = orders.processing;

      setScript(processingOrder.script);
      setLook(processingOrder.look);
      setVoice(processingOrder.voice);
      setIsFormLocked(true);
      setIsProcessing(true);

      const restoredPhoto = await restorePhotoFromOrder(processingOrder);

      if (restoredPhoto) {
        setPhoto(restoredPhoto);
      }

      await runGeneration({
        photoFile: restoredPhoto,
        script: processingOrder.script,
        look: processingOrder.look,
        voice: processingOrder.voice,
      });
    }

    restoreProcessingOrder();
  }, [restorePhotoFromOrder, runGeneration]);

  function handlePhotoChange(file) {
    if (isFormLocked) {
      return;
    }

    if (!file) {
      setPhoto(null);
      setPhotoError("");
      return;
    }

    const error = validatePhoto(file);
    setPhotoError(error);
    setPhoto(error ? null : file);
    setFormError("");
  }

  async function handleSubmit() {
    if (isFormLocked || loadOrders().processing) {
      return;
    }

    const validationError = validateForm({ photo, script });

    if (validationError) {
      setFormError(validationError);
      return;
    }

    clearErrorTimeout();
    setFormError("");

    const photoDataUrl = await fileToDataUrl(photo);
    const processingOrder = setProcessingOrder({
      id: createOrderId(),
      script: script.trim(),
      look,
      voice,
      photoName: photo.name,
      photoType: photo.type,
      photoDataUrl,
      createdAt: new Date().toISOString(),
    });

    setIsFormLocked(true);
    setIsProcessing(true);

    await runGeneration({
      photoFile: photo,
      script: processingOrder.script,
      look: processingOrder.look,
      voice: processingOrder.voice,
    });
  }

  const canSubmit =
    !isFormLocked &&
    !isProcessing &&
    Boolean(photo) &&
    Boolean(script.trim()) &&
    !photoError &&
    !isSubmitting;

  return (
    <main className={styles.home}>
      <div className={styles.layout}>
        <section className={styles.previewColumn}>
          <ViewWindow previewUrl={previewUrl} isProcessing={isProcessing} />
        </section>

        <section className={styles.controlsColumn}>
          <PhotoUpload
            file={photo}
            onChange={handlePhotoChange}
            error={photoError}
            disabled={isFormLocked}
          />
          <ScriptBox
            value={script}
            onChange={setScript}
            disabled={isFormLocked}
          />
          <LookSelector
            value={look}
            options={LOOK_OPTIONS}
            onChange={setLook}
            disabled={isFormLocked}
          />
          <VoiceSelector
            value={voice}
            options={VOICE_OPTIONS}
            onChange={setVoice}
            disabled={isFormLocked}
          />

          {formError && <p className={styles.error}>{formError}</p>}

          <SubmitButton
            disabled={!canSubmit}
            isLoading={isSubmitting}
            onClick={handleSubmit}
          />
        </section>
      </div>
    </main>
  );
}
