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
import java.util.List;
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


    public ResponseEntity<?> savePlanner(User currentUser, ArrayList<ArrayList<String>> plannerData)
    {

        Optional<MealPlanner> existingMealPlanner = plannerRepository.findByUser(currentUser);

        if (existingMealPlanner.isEmpty())
        {
            MealPlanner mealPlanner = new MealPlanner();
            mealPlanner.setUser(currentUser);
            fillPlanner(mealPlanner,plannerData);
            plannerRepository.save(mealPlanner);

            return new ResponseEntity<>(HttpStatus.OK);
        }
        else {

            return updatePlanner(plannerData,existingMealPlanner.get());
        }


    }

    public ResponseEntity<?> updatePlanner(ArrayList<ArrayList<String>> plannerData, MealPlanner mealPlanner)
    {
        plannerRepository.save(fillPlanner(mealPlanner,plannerData));
        return new ResponseEntity<>(mealPlanner,HttpStatus.OK);
    }

    private MealPlanner fillPlanner(MealPlanner mealPlanner, ArrayList<ArrayList<String>> plannerData) {
        mealPlanner.setMonday(String.join(",", plannerData.get(0)));
        mealPlanner.setTuesday(String.join(",", plannerData.get(1)));
        mealPlanner.setWednesday(String.join(",", plannerData.get(2)));
        mealPlanner.setThursday(String.join(",", plannerData.get(3)));
        mealPlanner.setFriday(String.join(",", plannerData.get(4)));
        mealPlanner.setSaturday(String.join(",", plannerData.get(5)));
        mealPlanner.setSunday(String.join(",", plannerData.get(6)));
        return mealPlanner;
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

}
