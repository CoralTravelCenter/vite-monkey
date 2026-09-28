import {createDataLayerWatcher} from "@utils";
import {createInitialState} from "./scripts/state.js";
import {createCheckAndLoadStyles} from "./scripts/stylesLoader.js";
import {subscribeToDataLayer} from "./scripts/dataLayerSubscriptions.js";

(async () => {
  const watcher = createDataLayerWatcher();
  const state = createInitialState();

  const checkAndLoadStyles =
    createCheckAndLoadStyles(state);

  subscribeToDataLayer({
    watcher,
    state,
    onStateChange: checkAndLoadStyles,
  });

  await checkAndLoadStyles();
})();
