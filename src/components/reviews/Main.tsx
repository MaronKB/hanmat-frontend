import React, { useState } from 'react';
import './Main.review.css'; // CSS 파일을 가져옴
import ReviewList from './ReviewList';
import Pagination from './Pagination';

const Main: React.FC = () => {
  const [sortOption, setSortOption] = useState<string>('NEW');
  const [currentPage, setCurrentPage] = useState<number>(1);

  return (
    <div className="main-container">
      <h2 className="main-title">Review of the Month</h2>
      <div className="main-controls">
        <button className="button-rv">My Reviews</button>
        <button className="button-cn">Create New</button>
        <select
          className="select"
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
        >
          <option value="NEW">Sort: New</option>
          <option value="OLD">Sort: Old</option>
        </select>
      </div>
      <ReviewList sortOption={sortOption} currentPage={currentPage} />
      <Pagination
        currentPage={currentPage}
        totalPages={5}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  );
};

export default Main;
