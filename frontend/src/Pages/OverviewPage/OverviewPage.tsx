import React, { useState } from 'react';
import { Sidebar } from '../../Components/common';
import styles from './OverviewPage.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

function OverviewPage() {
  const name = "이성효";
  const [isActive, setActive] = useState(true);
  
  const handleToggle = () => {
    setActive(!isActive);
}
  return (
    <>
    <div className={cx('overviewContainer')}>
      <Sidebar id={1} />
      <div className={cx('sideLine')}></div>
      <div>
        <div className={cx('overViewTitle')}>반갑습니다 {name}님!</div>
        <div className={cx('overViewDescription')}>댓글들을 분석하고 사용자들의 피드백을 확인해보세요!</div>
      </div>
    </div>
    <div className={ isActive ? cx('openedBar') : cx('closedBar')}>

    </div>
    </>
  );
}

export default OverviewPage;
