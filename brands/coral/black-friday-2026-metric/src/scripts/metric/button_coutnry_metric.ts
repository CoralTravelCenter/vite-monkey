export function button_coutnry_metric(input_country: string): void {
    if (typeof window.ym === 'function') {
        window.ym(96674199,'reachGoal','november_BF_select_tour', {
            name_country:{
                input_country
            }
        });
    }
}