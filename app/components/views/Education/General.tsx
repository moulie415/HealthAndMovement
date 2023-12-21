import React, {useEffect, useMemo} from 'react';
import {connect} from 'react-redux';
import Education, {Category} from '../../../types/Education';
import {MyRootState} from '../../../types/Shared';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StackParamList} from '../../../App';
import ArticleList from './ArticleList';
import {getEducation} from '../../../reducers/education';

const General: React.FC<{
  education: {[key: string]: Education};
  getEducationAction: () => void;
  navigation: NativeStackNavigationProp<StackParamList, 'Education'>;
}> = ({education, getEducationAction, navigation}) => {
  useEffect(() => {
    getEducationAction();
  }, [getEducationAction]);
  const filtered = useMemo(() => {
    return Object.values(education).filter(
      e => e.category === Category.GENERAL,
    );
  }, [education]);

  return <ArticleList filtered={filtered} navigation={navigation} />;
};

const mapStateToProps = ({education}: MyRootState) => ({
  education: education.education,
});

const mapDispatchToProp = {
  getEducationAction: getEducation,
};

export default connect(mapStateToProps, mapDispatchToProp)(General);
