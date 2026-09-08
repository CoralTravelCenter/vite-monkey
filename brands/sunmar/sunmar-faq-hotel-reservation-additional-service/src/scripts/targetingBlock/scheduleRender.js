import { removeFaq } from "./removeFaq.js";
import { renderFaq } from "./renderFaq.js";

let renderFrame = null;
let renderRevision = 0;

const isCurrentRevision = (revision) => revision === renderRevision;

export const scheduleRender = () => {
  renderRevision += 1;
  const revision = renderRevision;

  if (renderFrame !== null) cancelAnimationFrame(renderFrame);

  renderFrame = requestAnimationFrame(() => {
    renderFrame = null;
    void renderFaq(revision, isCurrentRevision).catch(() => {
      if (isCurrentRevision(revision)) removeFaq();
    });
  });
};

export const cancelScheduledRender = () => {
  renderRevision += 1;

  if (renderFrame === null) return;

  cancelAnimationFrame(renderFrame);
  renderFrame = null;
};
