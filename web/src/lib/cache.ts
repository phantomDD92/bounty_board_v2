import NodeCache from 'node-cache'
import { ChallengeDataType } from './verus';

const globalCache = new NodeCache();

export function registerChallenge(challenge: string) {
  let challenges: Set<string> = globalCache.get("challenges") || new Set<string>();
  challenges.add(challenge)
  globalCache.set("challenges", challenges)
}

export function checkChallenge(challenge: string) {
  let challenges: Set<string> = globalCache.get("challenges") || new Set<string>();
  console.log("Cache :", challenges);
  return challenges.has(challenge)
}

export function removeChallenge(challenge: string) {
  let challenges: Set<string> = globalCache.get("challenges") || new Set<string>();
  challenges.delete(challenge)
  globalCache.set("challenges", challenges);
}

export function setChallengeData(challenge: string, data: any) {
  globalCache.set(challenge, data);
}

export function getChallengeData(challenge: string):any {
  if (!globalCache.has(challenge))
    return undefined
  const data = globalCache.get(challenge);
  return data
}

export function clearChallengeData(challenge: string) {
  globalCache.del(challenge)
}