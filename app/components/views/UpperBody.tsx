import {Layout, Text} from '@ui-kitten/components';
import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {MyRootState} from '../../types/Shared';
import QuickRoutinesListProps from '../../types/views/QuickRoutinesList';
import QuickRoutineList from '../commons/QuickRoutineList';

const UpperBody: React.FC<QuickRoutinesListProps> = ({
  route,
  quickRoutines,
}) => {
  // @ts-ignore
  const {focus, equipment, area} = route.params.params;
  const [focusFilter, setFocusFilter] = useState(focus);
  const [equipmentFilter, setEquipmentFilter] = useState(equipment);

  const filtered = Object.values(quickRoutines).filter(routine => {
    return (
      routine.area === 'upper' &&
      (!focusFilter || focusFilter === routine.focus) &&
      (!equipmentFilter || equipmentFilter === routine.equipment)
    );
  });
  return <QuickRoutineList routines={filtered} />;
};

const mapStateToProps = ({quickRoutines}: MyRootState) => ({
  quickRoutines: quickRoutines.quickRoutines,
});

export default connect(mapStateToProps)(UpperBody);
