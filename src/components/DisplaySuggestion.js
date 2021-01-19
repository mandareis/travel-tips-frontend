import React, { useEffect } from "react";
import { observer } from "mobx-react";

function DisplaySuggestion(props) {
  // refetch data get "/suggestions"

  useEffect(() => {
    async function getSuggestion() {
      // get suggestion from /suggestions/props.params.id
    }
  }, []);
  console.log(props);
  return (
    <div>
      <p>Here's your new suggestion</p>
      <h3>dont know</h3>
      <p>dont know</p>
    </div>
  );
}

export default observer(DisplaySuggestion);
