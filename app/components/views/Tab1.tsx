import {Layout, Text} from '@ui-kitten/components';
import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {MyRootState} from '../../types/Shared';
import QuickRoutinesListProps from '../../types/views/QuickRoutinesList';
import QuickRoutineList from '../commons/QuickRoutinesList';

const Tab1: React.FC<QuickRoutinesListProps> = ({
  route,
  quickRoutines,
  navigation,
}) => {
  // @ts-ignore
  const {key} = route.params;

  const filtered = Object.values(quickRoutines).filter(routine => {
    return (
      (key === 'area' && routine.area === 'upper') ||
      (key === 'focus' && routine.focus === 'strength') ||
      (key === 'equipment' && routine.equipment === 'full')
    );
  });
  return <QuickRoutineList routines={filtered} navigation={navigation} />;
};

const mapStateToProps = ({quickRoutines}: MyRootState) => ({
  quickRoutines: quickRoutines.quickRoutines,
});

export default connect(mapStateToProps)(Tab1);