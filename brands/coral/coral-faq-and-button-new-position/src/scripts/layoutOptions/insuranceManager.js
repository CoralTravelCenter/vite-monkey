import {
    HIDDEN_TRACK_CLASS,
    INSURANCE_TITLE_SELECTOR,
    INSURANCE_TITLES,
    INSURANCE_TRACK_SELECTOR
} from "../utils/keys.js";

const hiddenTracks = new Set();

export function hideInsuranceTracks() {
    for (const track of hiddenTracks) {
        if (!track.isConnected) {
            track.classList.remove(HIDDEN_TRACK_CLASS);
            hiddenTracks.delete(track);
        }
    }

    const tracks = document.querySelectorAll(INSURANCE_TRACK_SELECTOR);

    for (const track of tracks) {
        const titleElements = track.querySelectorAll(INSURANCE_TITLE_SELECTOR);
        const titles = [];

        for (const title of titleElements) {
            titles.push(title.textContent.trim());
        }

        let isInsuranceTrack = true;
        for (const expectedTitle of INSURANCE_TITLES) {
            if (!titles.includes(expectedTitle)) {
                isInsuranceTrack = false;
                break;
            }
        }

        if (isInsuranceTrack) {
            if (!track.classList.contains(HIDDEN_TRACK_CLASS)) {
                track.classList.add(HIDDEN_TRACK_CLASS);
                hiddenTracks.add(track);
            }
        } else if (hiddenTracks.has(track)) {
            track.classList.remove(HIDDEN_TRACK_CLASS);
            hiddenTracks.delete(track);
        }
    }
}

export function restoreInsuranceTracks() {
    for (const track of hiddenTracks) {
        track.classList.remove(HIDDEN_TRACK_CLASS);
    }
    hiddenTracks.clear();
}