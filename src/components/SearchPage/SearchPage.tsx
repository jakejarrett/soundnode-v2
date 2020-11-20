import React from "react";
import { useParams } from "react-router-dom";

interface ComponentProps {}

export const SearchPage: React.FC<ComponentProps> = () => {
    const params = useParams();
    console.log(params);

  return (
    <div>
        Hello {params.query}
    </div>
  );
};
