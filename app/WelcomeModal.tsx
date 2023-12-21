import React, {useEffect, useState} from 'react';
import {useTourGuideController} from 'rn-tourguide';
import {MyRootState} from './types/Shared';
import {connect} from 'react-redux';
import {setHasViewedTour} from './reducers/profile';

const WelcomeModal: React.FC<{
  showSplash: boolean;
  hasViewedTour: boolean;
  setViewed: () => void;
  loggedIn: boolean;
}> = ({hasViewedTour, showSplash, setViewed, loggedIn}) => {
  const {
    canStart, // a boolean indicate if you can start tour guide
    start, // a function to start the tourguide
    getCurrentStep,
  } = useTourGuideController();
  useEffect(() => {
    if (!hasViewedTour && !showSplash && loggedIn) {
      start();
      setViewed();
    }
  }, [hasViewedTour, loggedIn, setViewed, showSplash, start]);
  return null;
};

const mapStateToProps = ({profile}: MyRootState) => ({
  hasViewedTour: profile.hasViewedTour,
  loggedIn: profile.loggedIn,
});

const mapDispatchToProps = {
  setViewed: setHasViewedTour,
};

export default connect(mapStateToProps, mapDispatchToProps)(WelcomeModal);
