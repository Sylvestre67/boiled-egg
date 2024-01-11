import dynamic from "next/dynamic";
import initRDKitModule from "@rdkit/rdkit";
import Workspace from "@/components/workspace";
import Link from "next/link";

export type Molecule = {
  molecule: string;
  TPSA: number;
  WLOGP: number;
  canonical_smiles: string;
};

export interface MoleculeStructureType extends Molecule {
  svg: TrustedHTML;
}

export type Universe = {
  TPSA: number;
  WLOGP: number;
};

const API_URL = process.env.API_URL;

async function getMolecules(): Promise<Molecule[]> {
  const res = await fetch(`${API_URL}/molecules`);
  if (!res.ok) {
    throw new Error("Failed to fetch molecules.");
  }

  return res.json();
}

async function getUniverses(): Promise<{ bbb: Universe[]; hia: Universe[] }> {
  const res = await fetch(`${API_URL}/universes`);
  if (!res.ok) {
    throw new Error("Failed to fetch molecules.");
  }

  return res.json();
}

export default async function Home() {
  const molecules = await getMolecules();
  const { bbb, hia } = await getUniverses();

  // @ts-ignore
  const rdkit = await initRDKitModule();

  const mols = molecules.reduce((mols: MoleculeStructureType[], molecule) => {
    const mol = rdkit.get_mol(molecule.canonical_smiles);
    const svg: TrustedHTML = mol.get_svg(140, 140);
    return [...mols, { ...molecule, svg }];
  }, []);

  return (
    <main className="min-h-screen p-12 max-w-[900px] mx-auto">
      <div className="mb-2">
        <h1 className="text-2xl mb-2">
          A BOILED-Egg To Predict Gastrointestinal Absorption and Brain
          Penetration of Small Molecules
        </h1>
      </div>
      <div className="flex">
        <Workspace molecules={mols} hia={hia} bbb={bbb} />
      </div>
      <p className="mb-3 bg-fixed">
        See{" "}
        <Link
          className="underling text-blue-600"
          href="http://onlinelibrary.wiley.com/doi/10.1002/cmdc.201600182/abstract"
        >
          A BOILED-Egg to predict gastrointestinal absorption and brain
          penetration of small molecules. ChemMedChem (2016) 11(11):1117-1121
        </Link>{" "}
        for full reference and supporting dataset.
      </p>
    </main>
  );
}
