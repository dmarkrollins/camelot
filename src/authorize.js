import handler from "./util/handler";

export const main = handler(async (event) => {

    let pin = null

    try {
        if (event.pathParameters && event.pathParameters.pin) {
            pin = event.pathParameters.pin
            if (pin !== '8608371691') {
                return { isValid: false }
            }
            return { isValid: true }
        }
        return { isValid: false }
    }
    catch (err) {
        return { isValid: false }
    }
})