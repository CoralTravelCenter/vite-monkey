import {reactDomObserver} from "@utils";
import {filter, firstValueFrom, map, timeout} from "rxjs";
import {createMobileWidget} from "./createMobileWidget.js";
import {MOBILE_HEADER} from "./utils/keys.js";

export async function initMobileWidget() {
    try {
        const domWatcher = reactDomObserver();
        const host = await firstValueFrom(
            domWatcher.observeSelector$(MOBILE_HEADER).pipe(
                filter(({ type }) => type !== "remove"),
                map(({ element }) => element),
                timeout({ first: 10000 }),
            ),
        );
        const element = createMobileWidget();
        host.prepend(element);
    }
    catch {}
}