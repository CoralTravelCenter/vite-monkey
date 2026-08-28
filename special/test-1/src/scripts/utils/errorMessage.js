export function outputErrorMessage(message, error) {
    const errName = error?.name || "Неизвестная ошибка";
    const errMessage = error?.message || String(error);
    console.error(
        `${message}\nИмя ошибки: ${errName}\nОписание ошибки: ${errMessage}`,
        `\nРазбор ошибки: `, error
    );
}