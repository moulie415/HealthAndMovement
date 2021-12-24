import React, {useMemo} from 'react';
import {connect} from 'react-redux';
import Education, {Category} from '../../../types/Education';
import {MyRootState} from '../../../types/Shared';
import ArticleList from './ArticleList';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StackParamList} from '../../../App';

const Nutritional: React.FC<{
  education: {[key: string]: Education};
  navigation: NativeStackNavigationProp<StackParamList, 'Education'>;
}> = ({education, navigation}) => {
  const filtered = useMemo(() => {
    return Object.values(education).filter(
      e => e.category === Category.NUTRITIONAL,
    );
  }, [education]);

  return <ArticleList filtered={filtered} navigation={navigation} />;
};

const mapStateToProps = ({education}: MyRootState) => ({
  education: education.education,
});

export default connect(mapStateToProps)(Nutritional);
