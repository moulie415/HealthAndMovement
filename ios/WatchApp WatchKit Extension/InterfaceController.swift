//
//  InterfaceController.swift
//  WatchApp WatchKit Extension
//
//  Created by Henry Moule on 26/05/2022.
//

import WatchKit
import Foundation
import WatchConnectivity


class InterfaceController: WKInterfaceController, WCSessionDelegate {
  var session: WCSession?

  
  override func awake(withContext context: Any?) {
      // Configure interface objects here.
    super.awake(withContext: context)
    if WCSession.isSupported() {
      self.session = WCSession.default
      self.session?.delegate = self
      self.session?.activate()
    }
  }
  
  
  
  // Called when the activation of a session finishes
  func session(_ session: WCSession, activationDidCompleteWith activationState: WCSessionActivationState, error: Error?) {
    self.session?.sendMessage(["isLoggedIn": true], replyHandler: { reply in
      if (reply["loggedIn"] != nil) {
        if (reply["loggedIn"] as! Int == 1) {
          Singleton.instance.loggedIn = true
        } else {
          Singleton.instance.loggedIn = false
        }
      }
    })
  }

  // Called when an immediate message arrives
  func session(_ session: WCSession, didReceiveMessage message: [String : Any], replyHandler: @escaping ([String : Any]) -> Void) {
    if (message["loggedIn"] != nil) {
      if (message["loggedIn"] as! Int == 1) {
        Singleton.instance.loggedIn = true
      } else {
        Singleton.instance.loggedIn = false
      }
    }
  }
    
  override func willActivate() {
      // This method is called when watch view controller is about to be visible to user
  }
  
  override func didDeactivate() {
      // This method is called when watch view controller is no longer visible
  }
  @IBAction func minimalEquipment() {
    Singleton.instance.equipment = "minimal"
  }
  
  @IBAction func fullEquipment() {
    Singleton.instance.equipment = "full"
  }
  
  @IBAction func upperBody() {
    Singleton.instance.area = "upper"
  }
  
  @IBAction func lowerBody() {
    Singleton.instance.area = "lower"
  }
  
  @IBAction func fullBody() {
    Singleton.instance.area = "full"
  }
}
