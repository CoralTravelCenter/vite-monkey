export function getIdForColor(id: number): string {
    let color;
    if (id % 3 === 0 && id % 5 !== 0) {
        color = "gradient-two";
    }
    else if (id % 5 === 0) {
        color = "gradient-three";
    }
    else {
        color = "gradient-one";
    }
    return color;
}