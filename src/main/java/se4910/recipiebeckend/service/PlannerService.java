package se4910.recipiebeckend.service;


import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import se4910.recipiebeckend.entity.MealPlanner;
import se4910.recipiebeckend.entity.User;
import se4910.recipiebeckend.repository.PlannerRepository;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Optional;

@Service
@AllArgsConstructor
public class PlannerService {

    PlannerRepository plannerRepository;

    public ArrayList<ArrayList<String>> getCurrentData(User currentUser) {
        Optional<MealPlanner> optionalMealPlanner = plannerRepository.findByUser(currentUser);
        if (optionalMealPlanner.isPresent()) {
            MealPlanner mealPlanner = optionalMealPlanner.get();
            ArrayList<ArrayList<String>> currentPlanner = new ArrayList<>();

            currentPlanner.add(new ArrayList<>(Arrays.asList(mealPlanner.getMonday().split(","))));
            currentPlanner.add(new ArrayList<>(Arrays.asList(mealPlanner.getTuesday().split(","))));
            currentPlanner.add(new ArrayList<>(Arrays.asList(mealPlanner.getWednesday().split(","))));
            currentPlanner.add(new ArrayList<>(Arrays.asList(mealPlanner.getThursday().split(","))));
            currentPlanner.add(new ArrayList<>(Arrays.asList(mealPlanner.getFriday().split(","))));
            currentPlanner.add(new ArrayList<>(Arrays.asList(mealPlanner.getSaturday().split(","))));
            currentPlanner.add(new ArrayList<>(Arrays.asList(mealPlanner.getSunday().split(","))));

            return currentPlanner;
        }
        return null;
    }


    public ResponseEntity<?> savePlanner(User currentUser,  String plannerData)
    {


        Optional<MealPlanner> existingMealPlanner = plannerRepository.findByUser(currentUser);

        if (existingMealPlanner.isEmpty())
        {
            MealPlanner mealPlanner = new MealPlanner();
            mealPlanner.setUser(currentUser);
            fillPlanner(mealPlanner,plannerData);
            plannerRepository.save(mealPlanner);

            return new ResponseEntity<>("planner created",HttpStatus.OK);
        }
        else {

           return updatePlanner(plannerData,existingMealPlanner.get());
        }


    }

    public ResponseEntity<?> updatePlanner(String plannerData, MealPlanner mealPlanner)
    {
        plannerRepository.save(fillPlanner(mealPlanner,plannerData));
        return new ResponseEntity<>("planner updated",HttpStatus.OK);
    }

    private MealPlanner fillPlanner(MealPlanner mealPlanner, String plannerData) {
        String[] daysAndMeals = plannerData.split(":");
        if (daysAndMeals.length == 7) { // Assuming you have data for each day of the week
            for (int i = 0; i < 7; i++) {
                String[] meals = daysAndMeals[i].split(",");
                String mealsString = String.join(",", meals); // Convert List<String> to String
                // Assuming your MealPlanner has setters for each day's meals
                switch (i) {
                    case 0:
                        mealPlanner.setMonday(mealsString);
                        break;
                    case 1:
                        mealPlanner.setTuesday(mealsString);
                        break;
                    case 2:
                        mealPlanner.setWednesday(mealsString);
                        break;
                    case 3:
                        mealPlanner.setThursday(mealsString);
                        break;
                    case 4:
                        mealPlanner.setFriday(mealsString);
                        break;
                    case 5:
                        mealPlanner.setSaturday(mealsString);
                        break;
                    case 6:
                        mealPlanner.setSunday(mealsString);
                        break;
                    default:
                        return null;
                }
            }
            return mealPlanner;
        }
        else {
            return null;
        }
    }


    public ResponseEntity<String> clearMealPlanner(User currentUser) {
        Optional<MealPlanner> optionalMealPlanner = plannerRepository.findByUser(currentUser);
        if (optionalMealPlanner.isPresent()) {
            MealPlanner mealPlanner = optionalMealPlanner.get();

            // Set all days' planner data to empty strings
            mealPlanner.setMonday("");
            mealPlanner.setTuesday("");
            mealPlanner.setWednesday("");
            mealPlanner.setThursday("");
            mealPlanner.setFriday("");
            mealPlanner.setSaturday("");
            mealPlanner.setSunday("");

            plannerRepository.save(mealPlanner);
            return new ResponseEntity<>(HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    public ResponseEntity<?> saveOneWeekPlanner(User currentUser, String plannerData) {

        MealPlanner mealPlanner = new MealPlanner();
        mealPlanner.setUser(currentUser);
        mealPlanner.setSavedWeek(plannerData);
        plannerRepository.save(mealPlanner);

        return new ResponseEntity<>(HttpStatus.OK);
    }
}
