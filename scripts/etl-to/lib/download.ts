/**
 * Módulo de download e extração de arquivos ZIP do TSE e IBGE.
 * Os arquivos do TSE usam encoding ISO-8859-1 e separador ponto-e-vírgula.
 */

import https from "https";
import http from "http";
import fs from "fs";
import path from "path";
import AdmZip from "adm-zip";

/**
 * Baixa um arquivo ZIP de uma URL e extrai em targetDir.
 * Retorna o caminho do diretório extraído.
 */
export async function downloadAndExtract(url: string, targetDir: string): Promise<string> {
  fs.mkdirSync(targetDir, { recursive: true });
  const zipPath = path.join(targetDir, "download.zip");

  await downloadFile(url, zipPath);

  const zip = new AdmZip(zipPath);
  zip.extractAllTo(targetDir, true);

  fs.unlinkSync(zipPath);
  return targetDir;
}

function downloadFile(url: string, dest: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    const protocol = url.startsWith("https") ? https : http;

    protocol.get(url, (response) => {
      // Segue redirecionamentos
      if (response.statusCode === 301 || response.statusCode === 302) {
        file.close();
        downloadFile(response.headers.location!, dest).then(resolve).catch(reject);
        return;
      }
      response.pipe(file);
      file.on("finish", () => file.close(() => resolve()));
    }).on("error", (err) => {
      fs.unlink(dest, () => reject(err));
    });
  });
}
