// services/formHandlers.ts

export const formHandlers = {
    orComparator(currentValue: string, parameters: string[]) {
        console.log(JSON.parse(JSON.stringify(currentValue)));

        return parameters.includes(currentValue);
    },

    simpaleComparator(currentValue: string, parameters: string[]) {

        return parameters.includes(currentValue);
    },

    customMethod(currentValue: string, parameters: string[]) {

        console.log("Custom logic here", currentValue, parameters);
        return true;
    }
};
