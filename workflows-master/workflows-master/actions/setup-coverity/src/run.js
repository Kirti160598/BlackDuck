import * as core from '@actions/core';
import * as tc from '@actions/tool-cache';
import { execSync } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

async function run() {
  try {
    const binPath = await getCoverity(process.env.COVERITY_VERSION);
    await downloadCoverityLicense(binPath);
    configureCoverityLanguage();
  } catch (error) {
    core.setFailed(error.message);
  }
}

async function getCoverity(version) {
  const toolPath = tc.find('coverity', version) || await downloadCoverity(version);
  const binPath = path.join(toolPath, 'bin');
  core.addPath(binPath);
  return binPath;
}

async function downloadCoverity(version) {
  const archiveName = `cov-analysis-linux64-${version}`;
  const artifact = `ciam-meid-maven-snapshots/coverity/${archiveName}.tar.gz`;
  const target = path.join(tempDir(), uuidv4())
  sh(`jf rt download ${artifact} ${target} --flat --split-count 15 --explode`)

  let toolRoot = path.join(tempDir(), archiveName);
  return await tc.cacheDir(toolRoot, 'coverity', version);
}

function tempDir() {
  const temp = process.env.RUNNER_TEMP;
  if (!temp) throw Error("RUNNER_TEMP env must be defined")
  return temp;
}

async function downloadCoverityLicense(coverityBinPath) {
  console.log("Obtaining Coverity license ..")
  const licenseUrl = `https://cov-connect.daimler.com/downloadFile.htm?fn=license.dat`;
  const licensePath = path.join(coverityBinPath, "license.dat")
  fs.rmSync(licensePath, { force: true })
  await tc.downloadTool(licenseUrl, licensePath, coverityAuthHeader());
}

function coverityAuthHeader() {
  const user = JSON.parse(process.env.COVERITY_AUTH_FILE).username
  const pass = JSON.parse(process.env.COVERITY_AUTH_FILE).key
  core.setSecret(pass);
  const authHeader = "Basic " + Buffer.from(`${user}:${pass}`).toString('base64')
  core.setSecret(authHeader);
  return authHeader
}

function configureCoverityLanguage() {
  const language = process.env.CONFIGURE_LANGUAGE;
  console.log(`Configuring Coverity for ${language} ..`)
  sh(`cov-configure --${language}`);
}

function sh(cmd) {
  console.log(`[${process.cwd()}] ${cmd}`)
  execSync(cmd, { stdio: "inherit" })
}

run();
