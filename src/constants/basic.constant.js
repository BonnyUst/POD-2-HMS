const GENDER = Object.freeze({
  MALE: "MALE",
  FEMALE: "FEMALE",
  OTHER: "OTHER"
});

const STATUS = Object.freeze({
  ACTIVE : "ACTIVE",
  INACTIVE : "INACTIVE"
});

const APMNT_STATUS = Object.freeze({
  BOOKED : "BOOKED",
  CANCELLED : "CANCELLED",
  COMPLETED : "COMPLETED"
})

const APPROVAL_STATUS = Object.freeze({
  PENDING : "PENDING",
  APPROVED : "APPROVED",
  REJECTED : "REJECTED"
});

module.exports = {GENDER,STATUS,APMNT_STATUS,APPROVAL_STATUS};

