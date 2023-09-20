export let doorSensorLastUpdate = 'date'

export const getDoorSensorLastUpdate = () => {
    return doorSensorLastUpdate;
}

export const setDoorSensorLastUpdate = (value: string) => {
    doorSensorLastUpdate = value;

    return doorSensorLastUpdate;
}