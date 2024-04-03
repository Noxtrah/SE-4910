package se4910.recipiebeckend.service;


import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import se4910.recipiebeckend.entity.MealPlanner;
import se4910.recipiebeckend.entity.User;
import se4910.recipiebeckend.repository.PlannerRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class PlannerService {

    PlannerRepository plannerRepository;

    public List<String> getCurrentData(User currentUser)
    {
       Optional<MealPlanner> optionalMealPlanner = plannerRepository.findByUser(currentUser);
       if (optionalMealPlanner.isPresent())
       {
           MealPlanner mealPlanner = optionalMealPlanner.get();
           List<String> currentPlanner = new ArrayList<String>();

           currentPlanner.add(mealPlanner.getMonday());
           currentPlanner.add(mealPlanner.getTuesday());
           currentPlanner.add(mealPlanner.getWednesday());
           currentPlanner.add(mealPlanner.getThursday());
           currentPlanner.add(mealPlanner.getFriday());
           currentPlanner.add(mealPlanner.getSaturday());
           currentPlanner.add(mealPlanner.getSunday());
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

    private MealPlanner fillPlanner(MealPlanner mealPlanner,  ArrayList<ArrayList<String>> plannerData)
    {
        mealPlanner.setMonday(plannerData.get(0).toString());
        mealPlanner.setTuesday(plannerData.get(1).toString());
        mealPlanner.setWednesday(plannerData.get(2).toString());
        mealPlanner.setThursday(plannerData.get(3).toString());
        mealPlanner.setFriday(plannerData.get(4).toString());
        mealPlanner.setSaturday(plannerData.get(5).toString());
        mealPlanner.setSunday(plannerData.get(6).toString());
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
