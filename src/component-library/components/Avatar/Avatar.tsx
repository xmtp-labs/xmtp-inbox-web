import Blockies from "react-blockies";

interface AvatarProps {
  /**
   * Are we waiting on an avatar url?
   */
  isLoading?: boolean;
  /**
   * What, if any, avatar url is there?
   */
  url?: string;
  /**
   * What is the address associated with this avatar?
   */
  address?: string;
}

export const Avatar = ({ url, isLoading, address }: AvatarProps) => {
  if (isLoading) {
    return (
      <div className="animate-pulse flex">
        <div className="rounded-full bg-gray-200 min-w-[40px] max-w-[40px] h-[40px]" />
      </div>
    );
  }

  if (url) {
    return (
      <img
        data-testid="avatar"
        className="min-w-[40px] max-w-[40px] h-[40px] rounded-full"
        src={url}
        alt={address}
      />
    );
  }

  return (
    <div data-testid="avatar">
      <Blockies
        data-testid="avatar"
        seed={address?.toLowerCase() || ""}
        scale={5}
        size={8}
        className="rounded-full"
      />
    </div>
  );
};
