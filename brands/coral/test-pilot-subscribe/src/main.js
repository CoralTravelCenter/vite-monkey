import { hostReactAppReady } from "@utils";

(async () => {
  await hostReactAppReady();
  document.body.insertAdjacentHTML(
    "afterbegin",
    `
      <form id="test-form" style="padding: 4em">
        <input type="email" placeholder="Email" />
        <button type="submit">Submit</button>
      </form>
    `,
  );

  const ENDPOINT = "/endpoints/Customer/AddSubscription";
  const FORM = document?.querySelector("#test-form");

  if (FORM) {
    FORM.addEventListener("submit", async (e) => {
      e.preventDefault();

      async function sendData(email) {
        const data = new FormData();
        data.append("email", email);

        const payload = {
          email: data.get("email"),
          source: location.pathname,
        }

        return fetch(ENDPOINT, {
          method: "POST",
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
          },
          body: JSON.stringify(payload),
        });
      }

      const emailInput = FORM?.querySelector('input[type="email"]');
      const email = emailInput ? emailInput.value : "";

      try {
        const res = await sendData(email);
        console.log("status:", res.status);
      } catch (err) {
        console.error(err);
      }
    });
  }
})();
