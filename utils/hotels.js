export function filterUniqueMatchingHotels(responses, requestedNames) {
    if (!responses.length || !requestedNames.length) {
        return [];
    }

    const requestedSet = new Set(
        requestedNames.map(name => name.trim().toUpperCase()).filter(Boolean)
    );

    const uniqueMap = new Map();

    responses.forEach(response => {
        response.result?.locations?.forEach(location => {
            const normalizedName = location.name.trim().toUpperCase();
            if (requestedSet.has(normalizedName) && !uniqueMap.has(location.id)) {
                uniqueMap.set(location.id, location);
            }
        });
    });

    return Array.from(uniqueMap.values());
}
