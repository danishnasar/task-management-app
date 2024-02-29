import React, { useState } from "react";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

export default function ProjectCard({
  id,
  taskName,
  label,
  effort,
  comments,
  itemClick
}) {

  return (
    <div onClick={() => itemClick(id)} className="m-2 bg-slate-50 hover:bg-slate-200 rounded-md cursor-pointer font-serif">
      <div className="flex flex-row">
        <p className="basis-1/2">
          {effort} <AccessTimeIcon />
        </p>
        <p className="basis-1/2">
          <ChatBubbleOutlineIcon /> {comments.length} 
        </p>
      </div>
      <p className="mt-2 font-bold">{taskName}</p>
      <p>{label}</p>
    </div>
  );
}
