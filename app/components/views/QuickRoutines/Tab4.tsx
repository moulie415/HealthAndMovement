import React, {useMemo} from 'react';
import {connect} from 'react-redux';
import {Goal, MyRootState} from '../../../types/Shared';
import QuickRoutinesListProps from '../../../types/views/QuickRoutinesList';
import QuickRoutineList from '../../commons/QuickRoutinesList';

const Tab4: React.FC<QuickRoutinesListProps> = ({
  route,
  quickRoutines,
  navigation,
}) => {
  // @ts-ignore
  const {key} = route.params;

  const filtered = useMemo(() => {
    return Object.values(quickRoutines).filter(routine => {
      return key === 'area';
    });
  }, [key, quickRoutines]);
  return <QuickRoutineList routines={filtered} navigation={navigation} />;
};

const mapStateToProps = ({quickRoutines}: MyRootState) => ({
  quickRoutines: quickRoutines.quickRoutines,
});

export default connect(mapStateToProps, null)(Tab4);
