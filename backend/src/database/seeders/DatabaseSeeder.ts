import { appointmentSeeder } from "./AppointmentSeeder";
import { businessHourSeeder } from "./BusinessHourSeeder";
import { centerSeeder } from "./CenterSeeder";
import { clientSeeder } from "./ClientSeeder";
import { dietPlanSeeder } from "./DietPlanSeeder";
import { dietitianCenterSeeder } from "./DietitianCenterSeeder";
import { dietitianSeeder } from "./DietitianSeeder";
import { foodAttributeSeeder } from "./FoodAttributeSeeder";
import { foodSeeder } from "./FoodSeeder";
import { mealSeeder } from "./MealSeeder";
import { planDetailSeeder } from "./PlanDetailSeeder";
import { roleSeeder } from "./RoleSeeder";
import { serviceSeeder } from "./ServiceSeeder";
import { userSeeder } from "./UserSeeder";





(async () => {
    await roleSeeder();
    await userSeeder();
    await serviceSeeder();
    await mealSeeder();
    await centerSeeder();
    await clientSeeder();
    await dietitianSeeder();
    await businessHourSeeder();
    await dietitianCenterSeeder();
    await appointmentSeeder(); 
    await foodSeeder(); 
    await foodAttributeSeeder(); 
    await dietPlanSeeder(); 
    await planDetailSeeder(); 
})();