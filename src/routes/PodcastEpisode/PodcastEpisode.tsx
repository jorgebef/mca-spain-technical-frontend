import { useParams } from "react-router-dom";
import { fetchPodcastTracks } from "../../lib/api";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { TrackResult } from "../../types/api";
import styles from "./PodcastEpisode.module.css";

export const PodcastEpisode = () => {
	const { podcastId, episodeId } = useParams();

	const [episodeData, setEpisodeData] = useState<TrackResult | undefined>(
		undefined,
	);

	const { data, error, isLoading } = useQuery({
		queryKey: ["trackList", podcastId],
		queryFn: () => fetchPodcastTracks(podcastId),
	});

	useEffect(() => {
		if (data === undefined || error || isLoading) return;
		const selectedEpisode = data.find(
			(e: TrackResult) => String(e.trackId) === episodeId,
		);
		setEpisodeData(selectedEpisode);
	}, [error, isLoading, data]);

	if (error) return <div>Error!!</div>;
	if (isLoading) return <div>Loading...</div>;
	if (episodeData === undefined || data === undefined)
		return <div>No data</div>;

	return (
		<div className={styles.container}>
			<div className={styles.info}>
				<h1>{episodeData.trackName}</h1>
				<p dangerouslySetInnerHTML={{ __html: episodeData.description }} />
				<audio controls src={episodeData.episodeUrl}></audio>
			</div>
		</div>
	);
};
