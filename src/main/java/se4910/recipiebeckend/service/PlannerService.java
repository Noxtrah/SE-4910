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

@Service
@AllArgsConstructor
public class PlannerService {

    PlannerRepository plannerRepository;

    public List<String> getCurrentData(User currentUser)
    {
       MealPlanner mealPlanner = plannerRepository.findByUser(currentUser);
       List<String> currentPlanner = new ArrayList<>();
        currentPlanner.add(mealPlanner.getMonday());
        currentPlanner.add(mealPlanner.getTuesday());
        currentPlanner.add(mealPlanner.getWednesday());
        currentPlanner.add(mealPlanner.getThursday());
        currentPlanner.add(mealPlanner.getFriday());
        currentPlanner.add(mealPlanner.getSaturday());
        currentPlanner.add(mealPlanner.getSunday());

        return currentPlanner;

    }

    public ResponseEntity<?> savePlanner(User currentUser, List<String> plannerData)
    {

        MealPlanner existingMealPlanner = plannerRepository.findByUser(currentUser);

        if (existingMealPlanner == null)
        {
            MealPlanner mealPlanner = new MealPlanner();
            mealPlanner.setUser(currentUser);
            fillPlanner(mealPlanner,plannerData);
            plannerRepository.save(mealPlanner);

            return new ResponseEntity<>(HttpStatus.OK);
        }

        return updatePlanner(plannerData,existingMealPlanner);

    }

    public ResponseEntity<?> updatePlanner(List<String> plannerData, MealPlanner mealPlanner)
    {
         fillPlanner(mealPlanner,plannerData);
        plannerRepository.save(mealPlanner);
         return new ResponseEntity<>(HttpStatus.OK);
    }

    private void fillPlanner(MealPlanner mealPlanner, List<String> plannerData)
    {   mealPlanner.setMonday(plannerData.get(0));
        mealPlanner.setTuesday(plannerData.get(1));
        mealPlanner.setWednesday(plannerData.get(2));
        mealPlanner.setThursday(plannerData.get(3));
        mealPlanner.setFriday(plannerData.get(4));
        mealPlanner.setSaturday(plannerData.get(5));
        mealPlanner.setSunday(plannerData.get(6));

    }
}
