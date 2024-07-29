export function JsonsIsEqual(JsonObject1, JsonObject2) {
    // Check if both arguments are objects
    if (typeof JsonObject1 !== 'object' || JsonObject1 === null || typeof JsonObject2 !== 'object' || JsonObject2 === null) {
        return JsonObject1 === JsonObject2;
    }

    // Get the keys of the objects
    const keys1 = Object.keys(JsonObject1);
    const keys2 = Object.keys(JsonObject2);

    // Check if the number of keys is the same
    if (keys1.length !== keys2.length) {
        return false;
    }

    // Check if all keys are the same
    for (const key of keys1) {
        if (!keys2.includes(key)) {
        return false;
        }
    }

    // Recursively compare values
    for (const key of keys1) {
        if (!JsonsIsEqual(JsonObject1[key], JsonObject2[key])) {
            return false;
        }
    }

    // If all checks pass, the objects are deeply equal
    return true;
}

export function ListOfJsonsIsEqual(JsonList1, JsonList2) {
    if (JsonList1.length !== JsonList2.length) {
        return false;
    }
    for (let i = 0; i < JsonList1.length; ++i) {
        if (!JsonsIsEqual(JsonList1[i], JsonList2[i])) {
            return false;
        }
    }
    return true;
}