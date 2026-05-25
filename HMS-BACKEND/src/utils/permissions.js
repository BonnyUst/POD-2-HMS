const permissions = {

    DASHBOARD: ["Admin"],

    ADD_PATIENT:["Admin", "Receptionist"],
    VIEW_PATIENT: ["Admin", "Receptionist", "Doctor"],
    UPDATE_PATIENT: ["Admin"],
    DELETE_PATIENT: ["Admin"],

    ADD_EMPLOYEE: ["Admin"],
    VIEW_EMPLOYEE: ["Admin"],
    UPDATE_EMPLOYEE: ["Admin"],
    DELETE_EMPLOYEE: ["Admin"]
}

module.exports =permissions;