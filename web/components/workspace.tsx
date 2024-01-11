"use client";

import MoleculeStructure from "@/components/moleculeStructure";
import BoiledEgg from "@/components/boiledEgg";
import { MoleculeStructureType, Universe } from "@/app/page";
import { useState } from "react";

export default function Workspace({
  molecules,
  hia,
  bbb,
}: {
  molecules: MoleculeStructureType[];
  hia: Universe[];
  bbb: Universe[];
}) {
  const [selectMolecules, setSelectMolecules] =
    useState<MoleculeStructureType[]>(molecules);

  const onBrush = (value: MoleculeStructureType[] | null) => {
    value ? setSelectMolecules(value) : setSelectMolecules(molecules);
  };

  return (
    <div className="w-full">
      <div className="p-2">
        <div className="flex items-center mb-3">
          <div
            className="w-4 h-4 border-2 mr-1"
            style={{ backgroundColor: "#FFD700" }}
          />{" "}
          Physicochemical space with high probability to permeate to the brain
          (BBB).
        </div>
        <div className="flex items-center mb-3">
          <div
            className="w-4 h-4 border-2 mr-1"
            style={{ backgroundColor: "#FFFFFF" }}
          />{" "}
          Physicochemical space with high probability of absorption by the
          gastrointestinal tract (HIA).
        </div>
      </div>
      <div className="flex-2 w-full bg-gray-200" style={{ height: 500 }}>
        <BoiledEgg
          molecules={molecules}
          hia={hia}
          bbb={bbb}
          onBrush={onBrush}
        />
      </div>
      <div className="flex flex-wrap min-h-[300px]">
        {selectMolecules.length ? (
          selectMolecules.map((molecule) => (
            <MoleculeStructure
              key={molecule.canonical_smiles}
              molecule={molecule}
            />
          ))
        ) : (
          <p className="mt-3">No molecules found in the selected area.</p>
        )}
      </div>
    </div>
  );
}
