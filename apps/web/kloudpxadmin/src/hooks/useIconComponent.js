import * as FaIcons from "react-icons/fa";
import * as MdIcons from "react-icons/md";
import * as AiIcons from "react-icons/ai";
import * as BiIcons from "react-icons/bi";
import * as GiIcons from "react-icons/gi";
import * as RiIcons from "react-icons/ri";
import * as TbIcons from "react-icons/tb";

const iconLibraries = {
  Fa: FaIcons,
  Md: MdIcons,
  Ai: AiIcons,
  Bi: BiIcons,
  Gi: GiIcons,
  Ri: RiIcons,
};

export const useIconComponent = (iconName) => {
  const prefix = iconName?.slice(0, 2);
  const IconPack = iconLibraries[prefix];

  if (IconPack && IconPack[iconName]) {
    return IconPack[iconName];
  }
  return null;
};
