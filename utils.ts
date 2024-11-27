import type dayjs from "dayjs";
import { promises as fs } from "fs";
import path from "path";

export default function generateRandomNumber(min: number, max: number): number {
  if (min > max) {
    throw new Error(
      "The min value must be less than or equal to the max value."
    );
  }
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function range(startOrEnd: number, end?: number): number[] {
  const start = end === undefined ? 0 : startOrEnd;
  const finalEnd = end === undefined ? startOrEnd : end;

  if (start >= finalEnd) return [];

  return Array.from({ length: finalEnd - start }, (_, i) => start + i);
}

export async function removeGitFolder(): Promise<void> {
  const gitFolderPath = path.join("./", ".git");

  try {
    await fs.rm(gitFolderPath, { recursive: true, force: true });
  } catch (error) {
    throw new Error(`Failed to remove .git folder`);
  }
}

export async function writeJsonToFile(
  filePath: string,
  jsonData: object
): Promise<void> {
  try {
    const jsonString = JSON.stringify(jsonData, null, 2);
    await fs.writeFile(filePath, jsonString, "utf8");
  } catch (error) {
    throw new Error(`Failed to write JSON data to ${filePath}`);
  }
}

export function isWeekend(date: dayjs.Dayjs): boolean {
  const dayOfWeek = date.day(); // 0 is Sunday, 6 is Saturday
  return dayOfWeek === 0 || dayOfWeek === 6;
}

export function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
