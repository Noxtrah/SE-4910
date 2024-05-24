package se4910.recipiebeckend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import se4910.recipiebeckend.entity.MealPlanner;
import se4910.recipiebeckend.entity.User;
import se4910.recipiebeckend.service.PlannerService;
import se4910.recipiebeckend.service.UserService;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping(value = "/planner", produces = MediaType.APPLICATION_JSON_VALUE)
public class PlannerController extends ParentController{



    @Autowired
    UserService userService;

    @Autowired
    PlannerService plannerService;


    @GetMapping("/get-current-data")
    public ArrayList<ArrayList<String>> getCurrentData(Authentication authentication)
    {
        User currentUser = getCurrentUser(authentication);
        if (currentUser != null)
        {
           return plannerService.getCurrentData(currentUser);
        }
        return null;
    }

    @PutMapping("/remove-weekly-plans")
    public ResponseEntity<String> removeWeeklyPlans(@RequestParam String username)
    {

        User currentUser = userService.getOneUserByUsername(username);
        return plannerService.removeWeeklyPlans(currentUser);
    }


    @PostMapping("save-planner")
    public ResponseEntity<?> savePlanner(@RequestBody String plannerData , Authentication authentication)
    {
        User currentUser = getCurrentUser(authentication);
        if (currentUser != null)
        {
            return plannerService.savePlanner(currentUser,plannerData);
        }

        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }

    @PostMapping("save-one-week")
    public ResponseEntity<?> savePlannerOneWeek(@RequestBody String plannerData , Authentication authentication)
    {
        User currentUser = getCurrentUser(authentication);
        if (currentUser != null)
        {
            return plannerService.saveOneWeekPlanner(currentUser,plannerData);
        }

        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }



    @GetMapping("/get-pre-weeks")
    public ResponseEntity<String> getPreWeeks(Authentication authentication)
    {
        User currentUser = getCurrentUser(authentication);
        if (currentUser != null)
        {
            return plannerService.getPreWeeks(currentUser);
        }

        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
    @DeleteMapping("clear-meal-planner")
    public ResponseEntity<String> clearMealPlanner(Authentication authentication)
    {
        User currentUser = getCurrentUser(authentication);
        if (currentUser != null)
        {
            return plannerService.clearMealPlanner(currentUser);
        }

        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }






}
