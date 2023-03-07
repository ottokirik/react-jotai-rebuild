import { ChangeEvent } from "react";
import { atom, useAtom, useAtomValue } from "./jotai";

const salaryAtom = atom(100_000);
const bonusAtom = atom(10_000);
const totalSalaryAtom = atom((get) => get(salaryAtom) + get(bonusAtom));
const dataAtom = atom(() => fetch("/data.json").then((res) => res.json()));

const SalaryDisplay = () => {
  const salary = useAtomValue(salaryAtom);

  return <div>Salary: {salary}</div>;
};

const TotalSalaryDisplay = () => {
  const totalSalary = useAtomValue(totalSalaryAtom);

  return <div>Total: {totalSalary}</div>;
};

const App = () => {
  const [salary, setSalary] = useAtom(salaryAtom);
  const [bonus, setBonus] = useAtom(bonusAtom);
  const data = useAtomValue(dataAtom);

  const handleChangeSalary = (event: ChangeEvent<HTMLInputElement>) => {
    setSalary(Number(event.target.value));
  };

  const handleChangeBonus = (event: ChangeEvent<HTMLInputElement>) => {
    setBonus(Number(event.target.value));
  };

  return (
    <div>
      <div>
        <input type="text" value={salary} onChange={handleChangeSalary} />
      </div>
      <SalaryDisplay />
      <div>
        <input type="text" value={bonus} onChange={handleChangeBonus} />
      </div>
      <TotalSalaryDisplay />
      <div>{JSON.stringify(data)}</div>
    </div>
  );
};

export default App;
