const permissions = {

    DASHBOARD: ["Admin"],

    ADD_PATIENT: ["Admin", "Receptionist"],
    VIEW_PATIENT: ["Admin", "Receptionist", "Doctor"],
    UPDATE_PATIENT: ["Admin"],
    DELETE_PATIENT: ["Admin"],

    ADD_EMPLOYEE: ["Admin"],
    VIEW_EMPLOYEE: ["Admin"],
    UPDATE_EMPLOYEE: ["Admin"],
    DELETE_EMPLOYEE: ["Admin"],

    ADD_DOCTOR: ["Admin"],
    VIEW_DOCTOR: ["Admin"],
    UPDATE_DOCTOR: ["Admin"],
    DELETE_DOCTOR: ["Admin"],

    ADD_APPOINTMENT:["Admin","Receptionist"],
    VIEW_APPOINTMENT:["Admin"],

    APPROVE_EMPLOYEE:["Admin"],
    PENDING_APPROVE_EMPLOYEE:["Admin"]
}

module.exports = permissions;