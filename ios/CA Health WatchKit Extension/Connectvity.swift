//
//  InterfaceController.swift
//  WatchApp WatchKit Extension
//
//  Created by Henry Moule on 26/05/2022.
//
import WatchKit
import Foundation
import WatchConnectivity
import HealthKit


class Connectivity: NSObject, WCSessionDelegate {
  var session: WCSession?
  var builder: HKLiveWorkoutBuilder?
  var workoutSession: HKWorkoutSession?

  init(session: WCSession = .default){
    super.init()
    if WCSession.isSupported() {
        self.session = WCSession.default
        self.session?.delegate = self
        self.session?.activate()
      }
    }
  
  
  // Called when the activation of a session finishes
  func session(_ session: WCSession, activationDidCompleteWith activationState: WCSessionActivationState, error: Error?) {

  }

  // Called when an immediate message arrives
  func session(_ session: WCSession, didReceiveMessage message: [String : Any], replyHandler: @escaping ([String : Any]) -> Void) {
    if (message["startQuickRoutine"] != nil || message["startWorkout"] != nil) {
     // startWorkout();
    }
  }
  
  func startWorkout() {
    if HKHealthStore.isHealthDataAvailable() {
      let typesToShare: Set = [
        HKQuantityType.workoutType()
      ]
      let typesToRead: Set = [
        HKQuantityType.quantityType(forIdentifier: .heartRate)!,
        HKQuantityType.quantityType(forIdentifier: .activeEnergyBurned)!,
      ]
      
      let healthStore = HKHealthStore()
      
      healthStore.requestAuthorization(toShare: typesToShare, read: typesToRead) { (success, error) in
        if (success) {
          
          let configuration = HKWorkoutConfiguration()
          configuration.activityType = .functionalStrengthTraining;
          configuration.locationType = .unknown;
          
          do {
            self.workoutSession = try HKWorkoutSession(healthStore: healthStore, configuration: configuration);
            self.builder = self.workoutSession?.associatedWorkoutBuilder();
            self.builder?.dataSource = HKLiveWorkoutDataSource(healthStore: healthStore,
                                                         workoutConfiguration: configuration);
            self.workoutSession?.startActivity(with: Date())
            self.builder?.beginCollection(withStart: Date()) { (success, error) in
              
              guard success else {
                return;
              }
                // Indicate that the session has started.
            }
          } catch {
              // Handle failure here.
              return
          }
          
        }
      }
    }

  }
  
  func endWorkout() {
    self.workoutSession?.end();
    self.builder?.endCollection(withEnd: Date()) { (success, error) in
        
        guard success else {
          return;
        }
        
      self.builder?.finishWorkout { (workout, error) in
            
            guard workout != nil else {
              return;
            }
            
            DispatchQueue.main.async() {
                // Update the user interface.
            }
        }
    }
  }


}
