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

        MealPlanner updatedMealPlanner = fillPlanner(mealPlanner, plannerData);
        plannerRepository.save(updatedMealPlanner);
        return new ResponseEntity<>("Planner updated", HttpStatus.OK);
    }


    private MealPlanner fillPlanner(MealPlanner mealPlanner, String plannerData) {
        String[] daysAndFoods = plannerData.split(":"); // Split by ":" to separate days

        // Iterate through each day and its foods
        for (int i = 0; i < daysAndFoods.length; i++) {
            String[] foods = daysAndFoods[i].split(","); // Split by "," to get individual foods
            String day = getDayOfWeek(i); // Get the corresponding day of the week

            // Set the foods for the corresponding day
            switch (day) {
                case "Monday":
                    mealPlanner.setMonday(String.join(",", foods));
                    break;
                case "Tuesday":
                    mealPlanner.setTuesday(String.join(",", foods));
                    break;
                case "Wednesday":
                    mealPlanner.setWednesday(String.join(",", foods));
                    break;
                case "Thursday":
                    mealPlanner.setThursday(String.join(",", foods));
                    break;
                case "Friday":
                    mealPlanner.setFriday(String.join(",", foods));
                    break;
                case "Saturday":
                    mealPlanner.setSaturday(String.join(",", foods));
                    break;
                case "Sunday":
                    mealPlanner.setSunday(String.join(",", foods));
                    break;
                default:
                    // Handle if necessary
                    break;
            }
        }

        return mealPlanner;
    }

    // Helper method to get the day of the week based on index
    private String getDayOfWeek(int index) {
        switch (index) {
            case 0:
                return "Monday";
            case 1:
                return "Tuesday";
            case 2:
                return "Wednesday";
            case 3:
                return "Thursday";
            case 4:
                return "Friday";
            case 5:
                return "Saturday";
            case 6:
                return "Sunday";
            default:
                return ""; // Handle if necessary
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

        Optional<MealPlanner> mealPlanner = plannerRepository.findByUser(currentUser);
        if (mealPlanner.isPresent())
        {
            mealPlanner.get().setSavedWeek(mealPlanner.get().getSavedWeek() + plannerData);
            plannerRepository.save(mealPlanner.get());
            return new ResponseEntity<>(HttpStatus.OK);
        }

        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }

    public ResponseEntity<String> getPreWeeks(User currentUser) {

        Optional<MealPlanner> mealPlanner = plannerRepository.findByUser(currentUser);
        return mealPlanner.map(planner -> new ResponseEntity<>(planner.getSavedWeek(), HttpStatus.OK)).orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    public ResponseEntity<String> removeWeeklyPlans(User currentUser) {

        Optional<MealPlanner> mealPlanner = plannerRepository.findByUser(currentUser);
        MealPlanner targetPlanner = mealPlanner.get();
        targetPlanner.setSavedWeek(null);
        plannerRepository.save(targetPlanner);
        if (targetPlanner.getSavedWeek().isEmpty())
        {
            return new ResponseEntity<>(HttpStatus.OK);
        }
        else return new ResponseEntity<>(HttpStatus.CONFLICT);

    }
}
