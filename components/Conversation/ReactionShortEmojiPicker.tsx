import clsx from "clsx";

interface Props {
  isMyMessage: boolean;
  handleReact: (emoji: string) => void;
}

const ReactionShortEmojiPicker = ({ isMyMessage, handleReact }: Props) => {
  return (
    <div className="min-w-[300px] w-[300px] min-h-[55px] h-[55px]">
      <div
        className={clsx(
          isMyMessage ? "ml-auto" : "mr-auto",
          "bg-white shadow border h-full rounded-full overflow-hidden flex items-center justify-between pl-[10px] pr-[8px] transition-all duration-500 reaction-short-emoji-picker-container",
        )}
        style={{ boxShadow: "0 1px 3px 0 rgba(0, 0, 0, .15)" }}>
        {["👍", "👎", "😄", "🎉", "😢", "🚀", "👀"].map((reaction) => (
          <button
            className={"min-w-[40px] min-h-[48px] text-[20px]"}
            onClick={() => handleReact(reaction)}
            key={reaction}>
            {reaction}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ReactionShortEmojiPicker;
