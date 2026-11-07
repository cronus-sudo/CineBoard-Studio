import { jsPDF } from "jspdf";
import { SceneBreakdown, Shot } from "../types";

export async function exportStoryboardPdf(scene: SceneBreakdown, shots: Shot[]) {
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Cover / Header Page
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, pageWidth, pageHeight, "F");

  // Title
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(26);
  doc.text(scene.title || "STORYBOARD SEQUENCE", 20, 30);

  // Slugline
  doc.setTextColor(245, 158, 11); // amber-500
  doc.setFontSize(14);
  doc.text(scene.slugline || "SCENE 1", 20, 42);

  // Logline & Meta
  doc.setTextColor(203, 213, 225); // slate-300
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  const splitLogline = doc.splitTextToSize(scene.logline || "", pageWidth - 40);
  doc.text(splitLogline, 20, 52);

  doc.setTextColor(148, 163, 184); // slate-400
  doc.setFontSize(10);
  doc.text(`Mood: ${scene.mood || "Cinematic"}`, 20, 70);
  doc.text(`Total Shots: ${shots.length}`, 20, 76);
  doc.text(`Generated with CineBoard Studio • Gemini 3 Pro Image & Director AI`, 20, 82);

  // Shots pages: 2 shots per page landscape
  let currentY = 95;
  let pageNumber = 1;

  for (let i = 0; i < shots.length; i++) {
    const shot = shots[i];
    
    // Add new page for each pair or starting shot 1 if cover is full
    if (i === 0) {
      doc.addPage("a4", "landscape");
      doc.setFillColor(15, 23, 42);
      doc.rect(0, 0, pageWidth, pageHeight, "F");
      currentY = 20;
    } else if (i % 2 === 0) {
      doc.addPage("a4", "landscape");
      doc.setFillColor(15, 23, 42);
      doc.rect(0, 0, pageWidth, pageHeight, "F");
      currentY = 20;
    }

    const colWidth = (pageWidth - 50) / 2;
    const startX = (i % 2 === 0) ? 20 : 25 + colWidth;

    // Shot Card Header
    doc.setFillColor(30, 41, 59); // slate-800
    doc.roundedRect(startX, currentY, colWidth, 165, 3, 3, "F");

    // Shot badge
    doc.setFillColor(245, 158, 11);
    doc.roundedRect(startX + 8, currentY + 8, 28, 8, 2, 2, "F");
    doc.setTextColor(15, 23, 42);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text(`SHOT #${shot.shotNumber}`, startX + 11, currentY + 13.5);

    // Shot Type & Camera
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.text(`${shot.shotType}`, startX + 40, currentY + 13.5);

    // Image container
    const imgX = startX + 8;
    const imgY = currentY + 20;
    const imgWidth = colWidth - 16;
    const imgHeight = 65;

    if (shot.imageUrl && shot.imageUrl.startsWith("data:image")) {
      try {
        doc.addImage(shot.imageUrl, "PNG", imgX, imgY, imgWidth, imgHeight, undefined, "FAST");
      } catch (err) {
        console.warn("Could not embed image into PDF", err);
        doc.setFillColor(51, 65, 85);
        doc.rect(imgX, imgY, imgWidth, imgHeight, "F");
        doc.setTextColor(148, 163, 184);
        doc.setFontSize(9);
        doc.text("[Image Format Unavailable]", imgX + 10, imgY + 30);
      }
    } else {
      doc.setFillColor(51, 65, 85);
      doc.rect(imgX, imgY, imgWidth, imgHeight, "F");
      doc.setTextColor(148, 163, 184);
      doc.setFontSize(9);
      doc.text("[Frame Not Generated]", imgX + 15, imgY + 30);
    }

    // Camera specs
    let detailY = imgY + imgHeight + 8;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(245, 158, 11);
    doc.text(`CAMERA: `, startX + 8, detailY);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(226, 232, 240);
    doc.text(`${shot.cameraMovement || "Static"} • Lens: ${shot.lens || "35mm"}`, startX + 28, detailY);

    // Panel Content Description
    detailY += 7;
    doc.setFont("helvetica", "bold");
    doc.setTextColor(245, 158, 11);
    doc.text(`PANEL:`, startX + 8, detailY);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 255, 255);
    const splitPanelDesc = doc.splitTextToSize(shot.panelDescription || shot.action || "", colWidth - 26);
    doc.text(splitPanelDesc, startX + 26, detailY);

    // Action
    detailY += Math.max(splitPanelDesc.length * 4.2, 7) + 2;
    doc.setFont("helvetica", "bold");
    doc.setTextColor(148, 163, 184);
    doc.text(`ACTION:`, startX + 8, detailY);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(203, 213, 225);
    const splitAction = doc.splitTextToSize(shot.action || "", colWidth - 26);
    doc.text(splitAction, startX + 26, detailY);

    // Dialogue (if present)
    if (shot.dialogue) {
      detailY += Math.max(splitAction.length * 4.5, 12);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(56, 189, 248); // sky-400
      doc.text(`DIALOGUE:`, startX + 8, detailY);
      doc.setFont("helvetica", "italic");
      doc.setTextColor(241, 245, 249);
      const splitDialogue = doc.splitTextToSize(`"${shot.dialogue}"`, colWidth - 28);
      doc.text(splitDialogue, startX + 28, detailY);
    }
  }

  const safeFilename = (scene.title || "storyboard").toLowerCase().replace(/[^a-z0-9]/g, "_");
  doc.save(`${safeFilename}_storyboard.pdf`);
}
