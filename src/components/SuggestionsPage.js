import React from "react";
import { observer } from "mobx-react";
import { useTravelStore } from "../TipsContext";

function SuggestionsPage() {
  const store = useTravelStore();
  return (
    <div>
      <h3> Hello {store.user?.name}. Welcome!</h3>
    </div>
  );
}

export default observer(SuggestionsPage);
