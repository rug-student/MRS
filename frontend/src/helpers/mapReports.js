  // Map the priority

  export const getPriorityText = (priority) => {
    switch (priority) {
      case -1:
        return "unset";
      case 1:
        return "low";
      case 2:
        return "mid";
      case 3:
        return "high";

      default:
        return "unset";
    }
  };

  //Map the status, when changed backend/app/Mail/SatusChanged.php should also be changed.

  export const getStatusText = (status) => {
    switch (status) {
      case 0:
        return "unresolved";
      case 1:
        return "resolved";
      case 2:
        return "in progress";
      case 3:
        return "dropped";

      default:
        return "unresolved";
    }
  };