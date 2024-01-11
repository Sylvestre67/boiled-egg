import type { MoleculeStructureType } from "@/app/page";
import styles from "./molecule-structure.module.css";

export default function MoleculeStructure({
  molecule,
}: {
  molecule: MoleculeStructureType;
}) {
  return (
    <div className="flex m-3">
      <div
        className={styles.molecule}
        dangerouslySetInnerHTML={{ __html: molecule.svg }}
      />
      <div className="flex flex-col justify-center">
        <h2 className="text-l font-bold">{molecule.molecule}</h2>
        <p className="text-sm text-gray-700">TPSA: {molecule.TPSA}</p>
        <p className="text-sm text-gray-700">WLOGP: {molecule.WLOGP}</p>
      </div>
    </div>
  );
}
