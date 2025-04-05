//import { navigate } from "../navigation/NavigationRef";
import { navigate } from "../../navigation/NavigationRef";

const homeController = {
  goToTasks: () => {
    navigate("Tasks");
  },
  goToCalendar: () => {
    navigate("Calendar");
  },
  logout: () => {
    navigate("Login");
  },
};

export default homeController;